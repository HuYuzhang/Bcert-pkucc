import { uploadCertPath } from "src/api";
import React from "react";

export const VerifyCert: React.FC = () => {
  return (
    <div className="banner">
      <div className="search">
        <div className="first">
          <span className="pas">上传需要验证的证书</span>
        </div>
        <div className="second">
          <div className="back">
            <form action={uploadCertPath} method="post" encType="multipart/form-data">
              <input type="file" name='file' accept=".pdf" className="upload"/>
              <input type="submit" value="验证" className="ok"/>
            </form>
          </div>
        </div>
      </div>
    </div>

  );
};
