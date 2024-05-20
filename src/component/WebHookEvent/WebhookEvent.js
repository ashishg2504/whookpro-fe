import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { getToken } from "../../utils/AuthStorage";
import 'react-toastify/dist/ReactToastify.css';
import { FaEye } from "react-icons/fa";
import moment from "moment"
import styled from "styled-components";
import ReactJson from 'react-json-view'

const GridContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5px;
  margin-bottom: 50px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;


function WebhookEvent({ setCurrentScreen, setSelectedWebhookId, selectedWebhookId }) {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [webhookDetail, setWebhookDetail] = useState({})
  const [eventDetail, setEventDetail] = useState({})

  useEffect(() => {
    handleWebhookDetail(selectedWebhookId)
    handleWebhookEvent(selectedWebhookId)
  }, [selectedWebhookId])


  const handleWebhookDetail = async (webhookId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/webhook/fetch/${webhookId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        }
      }
      );
      setWebhookDetail(response.data.data)
    } catch (error) {
      console.log("Error fetching details", error)
    }
  }

  const handleWebhookEvent = async (webhookId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/event/${webhookId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`
        }
      }
      );
      setTableData(response.data.data)
    } catch (error) {
      console.log("Error fetching details", error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleJson = (data) => {
    setShowModal(true)
    setEventDetail(data)
  }

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
          WebHook Event{" "}
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
            onClick={() => { setCurrentScreen("webhook") }}>Back</button>
        </div>
      </div>
      <GridContainer>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Source Name: </h3>
          <p className="margin-0">{webhookDetail?.sourceName}</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Source URL: </h3>
          <p className="margin-0">{webhookDetail?.sourceUrl}</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Callback URL: </h3>
          <p className="margin-0"
            style={{
              cursor: "pointer",
              color: "#0000EE",
              textDecoration: "underline"
            }}
            onClick={async () => {
              await navigator.clipboard.writeText(`${process.env.REACT_APP_API_URL}/event/${webhookDetail?.callbackCode}`);
              toast.success("Link Copied")
            }}> Click to Copy Link</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Event Count: </h3>
          <p className="margin-0">{webhookDetail?.eventCount}</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Status: </h3>
          <p className="margin-0">{webhookDetail?.isActive ? "Active" : "Cancelled"}</p>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          <h3 className="margin-0">Date: </h3>
          <p className="margin-0">{moment(webhookDetail?.createdAt).format("DD-MM-YYYY")}</p>
        </div>
      </GridContainer>
      <div style={{ width: "100%", overflow: "scroll", maxHeight: "55vh", border: "1px solid #a5a5a5", borderRadius: "10px" }}>
        {
          tableData.length > 0 ?
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead style={{ position: "sticky", top: "-1px" }}>
                <tr >
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Event Type</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Date</th>
                  <th style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px", backgroundColor: "rgb(247,248,250)" }}>Action</th>
                </tr>
              </thead>
              <tbody style={{ overflowY: "auto" }}>
                {tableData?.map((data, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{data?.type}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>{moment(data?.createdAt).format("DD-MM-YYYY hh:mm A")}</td>
                    <td style={{ border: "1px solid #dddddd", textAlign: "left", padding: "8px" }}>
                      <FaEye size={20} style={{ marginRight: "5px" }} onClick={(e) => handleJson(data?.eventDetail)} />
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99,
          }}
        >
          <div style={{
            maxHeight: "550px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "5px",
            width: "450px",
          }}>
            <div
              style={{
                maxHeight: "500px",
                overflow: "scroll"
              }}
            >
              <ReactJson src={eventDetail} theme={"monokai"} indentWidth={0} />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(0,209,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} onClick={async () => {
                const jsonString = JSON.stringify(eventDetail, null, 2);
                navigator.clipboard.writeText(jsonString).then(() => {
                  toast.success('JSON copied to clipboard!');
                }).catch(err => {
                  toast.error('Failed to copy!');
                  console.error('Could not copy text: ', err);
                });
              }}>Copy JSON</button>
              <button style={{ display: "flex", margin: "10px", fontSize: "16px", background: "rgb(255,0,0)", border: "none", borderRadius: "5px", padding: "5px 10px", color: "white", cursor: "pointer" }} onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default WebhookEvent;
