import React from "react";

const LikeButtonComponent = (props) => {
    const { dataHref } = props;
    return (
        <div className="fb-like mt-4" data-href={dataHref} data-width="" data-layout="" data-action="" data-size="" data-share="true"></div>
    );
};

export default LikeButtonComponent;