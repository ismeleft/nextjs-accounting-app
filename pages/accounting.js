import { useState, useEffect } from "react";
import styles from "../styles/home.module.css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import firebaseModule from "../utils/firebase";
import firebase from "../utils/firebase";
const { app, db, auth } = firebaseModule;
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";

const accounting = () => {
  //使用者是否登入的狀態
  const [user, setUser] = useState(null);

  const router = useRouter();
  const [transactionType, setTransactionType] = useState("收入");
  const [money, setMoney] = useState("");
  const [item, setItem] = useState("");
  const [total, setTotal] = useState(0);

  //用來接使用者輸入後的東西
  const [transactions, setTransactions] = useState([]);

  //偵測支出＆收入
  const handleTransactionChange = (e) => {
    setTransactionType(e.target.value);
  };

  //偵測金額
  const handleMoneyChange = (e) => {
    setMoney(e.target.value);
  };

  //偵測item
  const handleItemChange = (e) => {
    setItem(e.target.value);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const amount = transactionType === "收入" ? money : -money;
    //標示不同使用者的記帳紀錄
    const user = auth.currentUser;
    const newTransaction = { name: item, amount: amount, userId: user.uid };

    try {
      //把記帳資料放到firestore
      const docRef = await addDoc(collection(db, "accounting"), newTransaction);
      setMoney("");
      setItem("");
      setTransactions([...transactions, newTransaction]);
      setTotal(Number(amount) + Number(total));
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  const handleDeleteTransaction = async (id, amount) => {
    try {
      const transactionRef = doc(db, "accounting", id);
      await deleteDoc(transactionRef);

      const updatedTransactions = transactions.filter(
        (transaction) => transaction.id !== id
      );
      setTransactions(updatedTransactions);

      setTotal(total - amount);
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  useEffect(() => {
    //監聽使用者的登入狀態，如果有改變就執行callback
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData(currentUser);
      } else {
        router.push("/");
      }
    });

    //元件卸載時，或 router 變更時，執行取消監聽的操作，以確保清理sideEffecct並停止不再需要的監聽
    return () => {
      unsubscribe();
    };
  }, [router]);

  const fetchData = async (user) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "accounting"), where("userId", "==", user.uid))
      );
      const transactions = [];
      querySnapshot.forEach((doc) => {
        transactions.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactions);

      const totalAmount = transactions.reduce(
        (acc, transaction) => Number(acc) + Number(transaction.amount),
        0
      );
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  return (
    <div className={styles.accountingApp}>
      <form
        action=""
        className="accounting-form"
        onSubmit={handleAddTransaction}
      >
        <select name="" id="" onChange={handleTransactionChange}>
          <option value="收入">收入</option>
          <option value="支出">支出</option>
        </select>
        <input
          type="number"
          className="moneyInput"
          placeholder="請輸入金額"
          onChange={handleMoneyChange}
          value={money}
          required
        />
        <input
          className={styles.itemInput}
          type="text"
          placeholder="請輸入您的品項"
          value={item}
          onChange={handleItemChange}
          required
        />
        <button type="submit">送出</button>
      </form>
      <div className={styles.space}></div>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <span
              className={
                transaction.amount > 0 ? styles.positive : styles.negative
              }
            >
              {transaction.amount}
            </span>
            {transaction.name}
            <button
              className={styles.deleteBtn}
              onClick={() =>
                handleDeleteTransaction(transaction.id, transaction.amount)
              }
            >
              刪除
            </button>
          </li>
        ))}
      </ul>
      <hr />
      <p>總金額：{total}</p>
      <br />
      <br />
      <button
        onClick={() => {
          localStorage.removeItem("userToken");
          firebase.auth.signOut();
          router.push("/");
        }}
      >
        登出系統
      </button>
    </div>
  );
};

export default accounting;
