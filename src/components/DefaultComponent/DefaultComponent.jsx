import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";

const DefaultComponent = (props) => {
    const { children } = props;
    return (
        <div className="relative">
            <HeaderComponent />
            {children}
        </div>
    );
};

export default DefaultComponent;