import React from "react";
import images from "../../utils/ImageHelper";

export default function Footer() {

    return (
        <div className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 col-md-4">
                        <div className="footer_logo">
                            <a href="#top">
                                <img src={images.footerLogosvg} alt="footer" />
                            </a>
                            <p>Anlita trädgårdsproffs nära dig</p>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-8">
                        <div className="footer_follow">
                            <div className="footer_column_title">
                                <h2>Följ oss på</h2>
                                <hr className="footer_title_shape"></hr>
                            </div>
                            <div className="footer_follow_social">
                                <ul>
                                    <li>
                                        <a href="#top">
                                            <i className="fa fa-facebook" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#top">
                                            <i className="fa fa-instagram" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#top">
                                            <i className="fa fa-twitter" aria-hidden="true"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-4">
                        <div className="copyright_text">
                            <p>© FixWeDo 2020. All Rights Reserved</p>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-8">
                        <div className="copyright_menu">
                            <ul>
                                <li>
                                    <a href="#top">Support center</a>
                                </li>
                                <li>
                                    <a href="#top">Help and support</a>
                                </li>
                                <li>
                                    <a href="#top">Privacy policy</a>
                                </li>
                                <li>
                                    <a href="#top">Terms of service</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
