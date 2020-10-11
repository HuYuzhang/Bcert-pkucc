import React from "react";
import { useHistory } from "react-router-dom";
import { useBSSession } from "src/stores/BlockstackSessionStore";

export const CertList: React.FC = () => {

  const { session } = useBSSession();

  const { username } = session.loadUserData();

  return (
    <div className="row ruler">
      <div className="col-lg-12">
        <h2>Student {username}</h2>

        <p>
          {username} has certificates:
        </p>

        {/* <p>
          {data.map((person, index) => {
            if (person.id === name){
              return (
                <form method="get" action={"http://127.0.0.1:3000/certificates/"+username+".pdf"}>
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
