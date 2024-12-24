import React from "react";
import Slider from "react-slick";

const SlideComponent = ({ arrImages }) => {
    let settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };
    return (
        <div className="py-4">
            <Slider className="mx-auto max-w-screen-lg" {...settings}>
                {arrImages.map((item, index) => (
                    <img className="h-60" key={index} src={item} alt="slider" />
                ))}
            </Slider>

        </div>
    );
};

export default SlideComponent;