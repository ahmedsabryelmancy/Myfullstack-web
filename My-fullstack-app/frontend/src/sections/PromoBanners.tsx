import { featureBanners, secondaryBanners } from "../data/site";

export function PromoBanners() {
  return (
    <>
      <div className="banners_4">
        <div className="container">
          {featureBanners.map((banner) => (
            <div className="box" key={banner}>
              <a href="#" className="link_btn" aria-label="Open promotion" />
              <img src={banner} alt="Promotional product" />
              <div className="text">
                <h5>Break Disk</h5>
                <h5>deals on this</h5>
                <div className="sale">
                  <p>
                    Up <br /> Tp
                  </p>
                  <span>70%</span>
                  <h6>Shop Now</h6>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="banners">
        <div className="container">
          <div className="banners_boxs banner_2_img">
            {secondaryBanners.map((banner) => (
              <a href="#" className="box" key={banner}>
                <img src={banner} alt="Seasonal banner" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}