import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import styles from "./index.module.css";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const projectsQuery1 = api.example.getProjects.useInfiniteQuery(
    { cursor: 0 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: { pageParams: [undefined], pages: [{data: "someData", nextCursor: 10}]},
      onSuccess(data) {
        console.log(data.data); // infers the types from the placeholderData, but doesn't error
      },
    }
  );

  const projectsQuery2 = api.example.getProjects.useInfiniteQuery(
    { cursor: 0 },
    {
      // for some reason the infiniteQuery treats the placeholderData
      // as the source of truth for the types, so the next line gives
      // am error because nextCursor doesn't exist in null
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      placeholderData: { pageParams: [undefined], pages: [null] },
      onSuccess(data) {
        console.log(data.data); // infers the types from placeholderData and errors
      },
    }
  );

  // but the normal useQuery doesn't
  const projectsQuery3 = api.example.getProjects.useQuery(
    { cursor: 0 },
    {
      placeholderData: null,
      onSuccess(data) {
        console.log(data); // infers the types normally from the router and doesn't error
      },
    }
  );

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Create <span className={styles.pinkSpan}>T3</span> App
          </h1>
          <div className={styles.cardRow}>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>First Steps →</h3>
              <div className={styles.cardText}>
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className={styles.card}
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className={styles.cardTitle}>Documentation →</h3>
              <div className={styles.cardText}>
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <p className={styles.showcaseText}>
            {projectsQuery1.data?.pages[0] ? "test" : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
};

export default Home;
