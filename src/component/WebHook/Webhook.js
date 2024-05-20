import { useEffect, useState } from "react";
import { FcCancel } from "react-icons/fc";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { getToken } from "../../utils/AuthStorage";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";

function WebHook({ setCurrentScreen, setSelectedWebhookId }) {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteResourceId, setDeleteResourceId] = useState(null);
  const [formData, setFormData] = useState({
    sourceName: "",
    sourceUrl: ""
  });


  const handleTable = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/webhook/fetchAll`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        }
      }
      );
      console.log("Entries Fetched Successfully");
      setTableData(response.data.data);
    } catch (error) {
      console.log("Error fetching details", error)
    }
  }
  useEffect(() => {
    handleTable();
  }, [])

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteModal(false);
  };

  const handleAddDataClick = () => {
    setShowModal(true);
  };

  const handleDeleteClick = (webhookId) => {
    setDeleteModal(true);
    setDeleteResourceId(webhookId);
  };

  const handleViewEvent = (webhookId) => {
    setCurrentScreen("event")
    setSelectedWebhookId(webhookId)
  }

  // add new entry
  const handleForm = async (e) => {
    try {
      e.preventDefault()

      let urlRegex = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i

      if (!urlRegex.test(formData.sourceUrl)) {
        toast.error("Invalid URL Format")
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/webhook/create`,
        formData,
        {
          headers: {
            "Authorization": `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
        }
      );

      await navigator.clipboard.writeText(`${process.env.REACT_APP_API_URL}/event/${response?.data?.data?.callbackCode}`);

      toast.success("WebHook added successfully, Callback URL Copied");
      setFormData({
        sourceName: "",
        sourceUrl: ""
      })
      handleTable();
      handleCloseModal();
    } catch (error) {
      console.log(error)
      toast.error("Failed Adding Webhook")
    }
  };

  // delete Entry  
  const handleDelete = async () => {
    try {

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/webhook/cancel/${deleteResourceId}`, {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          },
        }
      );

      toast.success("Webhook Cancelled!!");
      handleTable();
      handleCloseModal();
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            fontWeight: "600",
            justifyContent: "start",
            alignItems: "center",

          }}
        >
          WebHook{" "}
        </div>
        <div style={{ display: "flex", marginLeft: "auto", marginRight: "10px" }}>
          <button style={{
            backgroundColor: "#FF5500",
            fontSize: "18px",
            border: "none",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
          }}
            onClick={handleAddDataClick}>Add</button>
        </div>
      </div>
      <div style={{ width: "100%", overflow: "scroll", maxHeight: "70vh", border: "1px solid #a5a5a5", borderRadius: "10px" }}>
        {
          tableData.length > 0 ?
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ position: "sticky", top: "-1px" }}>
                <tr >
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Source Name</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Source Url</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Callback Url</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Status</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ overflowY: "auto" }}>
                {tableData?.map((data, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{data?.sourceName}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{data?.sourceUrl}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{`${process.env.REACT_APP_API_URL}/event/${data?.callbackCode}`}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{data?.isActive ? "Active" : "Cancelled"}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                      <FaEye size={20} style={{ marginRight: "5px" }} onClick={(e) => handleViewEvent(data?._id)} />
                      {
                        data?.isActive ?
                          <FcCancel size={20} color={"red"} style={{ marginRight: "5px" }} onClick={(e) => handleDeleteClick(data?._id)} />
                          :
                          <></>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            :
            <p>No Data Available</p>
        }
      </div>
      {/* Add new data */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "450px",
            }}
          >
            <form onSubmit={(e) => { handleForm(e) }}>
              <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}>Add Webhook</div>
              <div style={{ display: "flex", flexDirection: "row", alignItem: "center", width: "100%" }}>
                <label style={{ width: "40%", display: "flex", alignItem: "center", margin: "auto", padding: "5px" }}>Source Name </label>
                <input type="text" style={{ margin: "10px", padding: "5px", display: "flex", width: "60%" }}
                  value={formData.sourceName} onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })} required
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row", alignItem: "center", width: "100%" }}>
                <label style={{ width: "40%", display: "flex", alignItem: "center", margin: "auto", padding: "5px" }}>Source URL </label>
                <input type="text" style={{ margin: "10px", padding: "5px", display: "flex", width: "60%" }}
                  value={formData.sourceUrl} onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })} required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(0,209,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} type="submit">Add</button>
                <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(255,0,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Entry */}
      {deleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px",
              width: "450px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: "10px" }}>Are you sure you want to Cancel Webhook?</div>

            <div style={{ display: "flex", justifyContent: "center" }}>
              <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(0,209,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} onClick={handleDelete}>Yes</button>
              <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(255,0,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} onClick={handleCloseModal}>No</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default WebHook;
