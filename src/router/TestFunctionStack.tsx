import React, { useEffect, useMemo, useRef, useState } from "react";
import { Route, Router, useLocation, useRoute, useRouter } from "wouter";
import { RoutesList } from "./RoutesList";
import { EPlayState } from "../types";
import BlogPage from "../pages/blogPage/BlogPage";
import HomePage from "../pages/homePage/HomePage";

function TestFunctionStack() {
  // location
  const router = useRouter();
  const [location, setLocation] = useLocation();

  /**
   * Increment counter
   */
  const [count, setCount] = useState(0);
  useEffect(() => setCount(count + 1), [location]);

  /**
   * Transition
   */
  const [playState, setPlayState] = useState(EPlayState.PLAY_IN);

  let Instance: any = useMemo(() => null, []);
  let OldInstance: any = useMemo(() => null, []);

  useEffect(() => {
    console.log(Instance);
    console.log(OldInstance);
  }, [location]);

  //const [match] = useRoute(location);

  return (
    <div>
      <Route path={"/"}>
        <HomePage
          playState={playState}
          transitonComplete={play => setPlayState(play)}
        />
      </Route>
      <Route path={"/blog"}>
        <BlogPage />
      </Route>

      {/*{RoutesList.map((el, i) => {*/}
      {/*  Instance = el.component as any;*/}

      {/*  return (*/}
      {/*    <Route path={el.path} key={i}>*/}
      {/*      { OldInstance &&*/}
      {/*      <OldInstance*/}
      {/*          playState={playState}*/}
      {/*          transitonComplete={play => setPlayState(play)}*/}
      {/*      />*/}
      {/*      }*/}

      {/*      { Instance &&*/}
      {/*        <Instance*/}
      {/*          playState={playState}*/}
      {/*          transitonComplete={play => setPlayState(play)}*/}
      {/*        />*/}
      {/*      }*/}
      {/*    </Route>*/}
      {/*  );*/}
      {/*})}*/}
    </div>
  );
}

export default TestFunctionStack;
