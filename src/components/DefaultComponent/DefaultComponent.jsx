import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";

const DefaultComponent = (props) => {
    const { children } = props;
    return (
        <div className="relative">
            <HeaderComponent />
            {children}
            <FooterComponent />
        </div>
    );
};

export default DefaultComponent;