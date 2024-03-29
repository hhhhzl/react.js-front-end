import React from "react";

export default function TabContentTest() {
    return (
        <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="home" title="Home">
                <Sonnet />
            </Tab>
            <Tab eventKey="profile" title="Profile">
                <Sonnet />
            </Tab>
            <Tab eventKey="contact" title="Contact" disabled>
                <Sonnet />
            </Tab>
        </Tabs>
    );
}