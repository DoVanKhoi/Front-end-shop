export const isJsonString = (data) => {
    try {
        JSON.parse(data);
    } catch (error) {
        return false;
    }
    return true;
}

export const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export const formatPrice = (price) => {
    try {
        return price.toLocaleString('vi-VN');
    } catch (error) {
        return price;
    }
}

export const initFacebookSdk = () => {
    if (window.FB) {
        window.FB.XFBML.parse();
    }
    let locale = 'vi_VN';
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FB_ID,
            xfbml: true,
            version: 'v9.0'
        });
    };
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = `https://connect.facebook.net/${locale}/sdk.js`;
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}