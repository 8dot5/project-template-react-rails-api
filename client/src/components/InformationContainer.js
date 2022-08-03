import { Route, Switch, useHistory } from "react-router-dom";
import AdminContainer from "./admin/AdminContainer";
import PlayerContainer from "./player/PlayerContainer";
import EveryoneContainer from "./everyone/EveryoneContainer";
import LoginModal from "./everyone/LoginModal";
import { useState, useEffect } from "react";

function InformationContainer({ loginModalOpen, setLoginModalOpen, setUser }) {
  const [recCenters, setRecCenters] = useState([]);

  useEffect(() => {
    console.log("useEffect called");
    fetch(`http://localhost:3000/rec_centers`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("info container fetch", data);
        setRecCenters(data);
      });
  }, []);

  return (
    <Switch>
      <Route path="/admin">
        <AdminContainer
          recCenters={recCenters}
          loginModalOpen={loginModalOpen}
          setLoginModalOpen={setLoginModalOpen}
        />
      </Route>
      <Route path="/home">
        <PlayerContainer recCenters={recCenters} />
      </Route>
      {/* <Route path="/login">{onLoginPath}</Route> */}
      <Route path="/">
        <EveryoneContainer
          recCenters={recCenters}
          loginModalOpen={loginModalOpen}
          setLoginModalOpen={setLoginModalOpen}
          setUser={setUser}
        />
      </Route>
    </Switch>
  );
}

export default InformationContainer;
