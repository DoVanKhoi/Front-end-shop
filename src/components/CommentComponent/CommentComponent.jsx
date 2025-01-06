import React from "react";

const CommentComponent = (props) => {
    const { dataHref } = props;
    return (
        <div className="fb-comments" data-href={dataHref} data-width="100%" data-numposts="5" data-order-by="reverse_time"></div>
    );
};

export default CommentComponent;