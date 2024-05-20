import { useEffect, useState } from 'react';
import { AppBar } from '@material-ui/core';
import { Link, useHistory } from "react-router-dom";
import { clearAuthData, getToken } from '../../utils/AuthStorage';
import WebHook from '../WebHook/Webhook';
import WebhookEvent from '../WebHookEvent/WebhookEvent';

function AuthComponent() {
    const [currentScreen, setCurrentScreen] = useState("webhook");
    const [selectedWebhookId, setSelectedWebhookId] = useState("")
    const history = useHistory();

    useEffect(() => {
        if (!getToken()) {
            history.push("/")
        }
    }, [])

    return (
        <>
            <AppBar style={{ height: "50px", background: "black" }}>
                <div className="headcont">
                    <header className="header">
                        <div className="header-left">WHook Pro</div>
                        <div className="header-right">
                            <Link to="/">
                                <button className="buttonLogout"
                                    onClick={() => { clearAuthData() }}
                                >Logout</button>
                            </Link>
                        </div>
                    </header>
                </div>
            </AppBar>
            <div style={{ display: 'flex', height: '100%', minHeight: '400px', width: "99vw", marginTop: "60px", position: "fixed" }}>
                <div style={{ width: "100%" }}>
                    <main style={{ padding: 20 }}>
                        {
                            currentScreen == "webhook" && <WebHook setCurrentScreen={setCurrentScreen} setSelectedWebhookId={setSelectedWebhookId} />
                        }
                        {
                            currentScreen == "event" && <WebhookEvent setCurrentScreen={setCurrentScreen} setSelectedWebhookId={setSelectedWebhookId} selectedWebhookId={selectedWebhookId} />
                        }
                    </main>
                </div>

            </div>

        </>
    )
}

export default AuthComponent