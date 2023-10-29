import React, { useState } from "react";
import { Menu, Form, Container } from "semantic-ui-react";
// import "semantic-ui-css/semantic.min.css";
import firebaseModule from "../utils/firebase";
const { app, db, auth } = firebaseModule;
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import styles from "../styles/home.module.css";

const Signin = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit() {
    const authFunction =
      activeItem === "register"
        ? createUserWithEmailAndPassword
        : signInWithEmailAndPassword;

    // 登录成功后存储用户的身份验证令牌到localStorage
    authFunction(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        user.getIdToken().then((userToken) => {
          localStorage.setItem("userToken", userToken);
          router.push("/accounting");
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error);
      });
  }

  return (
    <Container>
      <Menu widths={2}>
        <Menu.Item
          active={activeItem === "register"}
          onClick={() => setActiveItem("register")}
        >
          註冊
        </Menu.Item>
        <div className={styles.space}>/</div>

        <Menu.Item
          active={activeItem === "signin"}
          onClick={() => setActiveItem("signin")}
        >
          登入
        </Menu.Item>
      </Menu>
      <Form onSubmit={onSubmit}>
        <Form.Input
          label="信箱"
          type="email"
          placeholder="請輸入信箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></Form.Input>
        <div className={styles.space}></div>

        <Form.Input
          label="密碼"
          type="password"
          placeholder="請輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Form.Input>
        <div className={styles.space}></div>

        <Form.Button>
          {activeItem === "register" && "註冊"}
          {activeItem === "signin" && "登入"}
        </Form.Button>
      </Form>
    </Container>
  );
};

export default Signin;
