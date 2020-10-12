import React from "react";
import { useBSSession } from "src/stores/BlockstackSessionStore";
import { UserInfo } from "./UserInfo";

export const CertList: React.FC = () => {

  const { session } = useBSSession();

  const { username } = session.loadUserData();

  return (
    <div className="row ruler">
      <div className="col-lg-12">
        <UserInfo />
      </div>
      <div className="col-lg-12">
        <h2>Student {username}</h2>

        <p>
          {username} has certificates:
        </p>

        {/* <p>
          {data.map((person, index) => {
            if (person.id === name){
              return (
                <form method="get"
                action={"http://127.0.0.1:3000/certificates/"+username+".pdf"}>
                  <p>PKU_2020_Graduate_{ person.name }</p>
                  <button className="btn btn-primary" type="submit">查看</button>
                </form>
              )
            }
          })}
        </p> */}
      </div>
    </div>
  );
};
