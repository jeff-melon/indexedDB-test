import React, { useState } from "react";

const IdbTest = () => {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");

  const [selectedId, setSelectedId] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  const [allUsers, setAllUsers] = useState([]);

  // 1. indexedDB 객체 가져오기
  const idb = window.indexedDB;

  // 2. 브라우저에서 지원하는지 체크하기
  if (!idb) {
    window.alert("해당 브라우저에서는 indexedDB를 지원하지 않습니다.");
  } else {
    let db;
    const request = idb.open("testDB"); // 3. testDB(db) 열기

    request.onupgradeneeded = (e) => {
      db = e.target.result;
      db.createObjectStore("adminDB", { keyPath: "id" }); // 4. name저장소 만들고, key는 id로 지정
      request.onerror = (e) => alert("failed");
      request.onsuccess = (e) => (db = request.result); // 5. 성공시 db에 result를 저장
    };
  }

  const setDataToIndexedDB = () => {
    const dbOpen = idb.open("testDB");

    dbOpen.onsuccess = () => {
      const db = dbOpen.result;
      const transaction = db.transaction("userDB", "readwrite");
      const userDB = transaction.objectStore("userDB");

      const users = userDB.put({
        id,
        name,
        email,
        age,
      });

      users.onsuccess = () => {
        transaction.oncomplete = () => {
          db.close();
        };
      };

      users.onerror = (e) => {
        console.log("error", e);
      };
    };
    getAllDataFromIndexedDB();
  };
  const getDataFromIndexedDB = () => {
    const dbOpen = idb.open("testDB");

    dbOpen.onsuccess = () => {
      let db = dbOpen.result;
      const transaction = db.transaction("userDB", "readonly");
      const userDB = transaction.objectStore("userDB");
      const users = userDB.get(id);

      users.onsuccess = (e) => {
        let value = e.srcElement.result;
        if (value) {
          setSelectedId(value.id);
          setSelectedName(value.name);
          setSelectedEmail(value.email);
          setSelectedAge(value.age);
        } else {
          alert("존재하지 않는 id 입니다.");
        }
      };

      users.onerror = (e) => {
        console.log("error", e);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  };
  const getAllDataFromIndexedDB = () => {
    const dbOpen = idb.open("testDB");

    dbOpen.onsuccess = () => {
      let db = dbOpen.result;
      const transaction = db.transaction("userDB", "readonly");
      const userDB = transaction.objectStore("userDB");
      const users = userDB.getAll();

      users.onsuccess = (e) => {
        setAllUsers(e.target.result);
      };

      users.onerror = (e) => {
        console.log("error", e);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
  };
  const deleteDataFromIndexedDB = () => {
    const dbOpen = idb.open("testDB");

    dbOpen.onsuccess = () => {
      let db = dbOpen.result;
      const transaction = db.transaction("userDB", "readwrite");
      const userDB = transaction.objectStore("userDB");
      const users = userDB.delete(id);

      users.onsuccess = (e) => {
        alert("delete completed!");
      };

      users.onerror = (e) => {
        console.log("error", e);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };
    getAllDataFromIndexedDB();
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          position: "absolute",
          top: "30px",
          zIndex: "-1",
        }}
      >
        IndexedDB Test Page
      </h1>
      <section
        style={{
          gap: "20px",
          display: "inline-grid",
          gridTemplateColumns: "repeat(1, 800px)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          <section style={{ display: "flex", gap: "12px" }}>
            <textarea
              style={{ resize: "none" }}
              onChange={(e) => setId(e.target.value)}
              placeholder="id"
            />
            <textarea
              style={{ resize: "none" }}
              onChange={(e) => setName(e.target.value)}
              placeholder="name"
            />
            <textarea
              style={{ resize: "none" }}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <textarea
              style={{ resize: "none" }}
              onChange={(e) => setAge(e.target.value)}
              placeholder="age"
            />
          </section>
          <button
            style={{ width: "50px", height: "50px" }}
            onClick={setDataToIndexedDB}
          >
            Set Data
          </button>
        </div>
        <hr style={{ width: "90%" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <textarea
              style={{ width: "50px", height: "20px", resize: "none" }}
              placeholder="id"
              onChange={(e) => setId(e.target.value)}
            />
            <button
              style={{ width: "50px", height: "50px" }}
              onClick={getDataFromIndexedDB}
            >
              Get Data
            </button>
          </div>
          {selectedId && (
            <section style={{ display: "flex", gap: "10px" }}>
              <p>Selected Data - </p>
              <p>id: {selectedId} |</p>
              <p>name: {selectedName} |</p>
              <p>email: {selectedEmail} |</p>
              <p>age: {selectedAge}</p>
            </section>
          )}
        </div>
        <hr style={{ width: "90%" }} />
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            style={{ width: "130px", height: "50px" }}
            onClick={getAllDataFromIndexedDB}
          >
            Get All Data
          </button>
          <section>
            {allUsers.map((user, index) => {
              return (
                <div
                  style={{ display: "flex", marginTop: "10px", gap: "10px" }}
                  key={index}
                >
                  <div>{index + 1}) </div>
                  <div>id: {user.id} |</div>
                  <div>name: {user.name} |</div>
                  <div>email: {user.email} |</div>
                  <div>age: {user.age} </div>
                </div>
              );
            })}
          </section>
        </div>
        <hr style={{ width: "90%" }} />
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <textarea
              style={{ width: "50px", height: "20px", resize: "none" }}
              placeholder="id"
              onChange={(e) => setId(e.target.value)}
            />
            <button
              style={{ width: "50px", height: "50px" }}
              onClick={deleteDataFromIndexedDB}
            >
              Delete Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IdbTest;
