import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useRouter } from "next/router";
import styles from "styles/landingpage.module.css";

const cardsData = [
  {
    title: "Kasambahay",
    subTitle: "Look for your Employer",
    image: "/layout/serviceoffered1.jpg",
    description:
      "Find a dependable family and home services in one location with a single tap.",
    buttonLabel: "Apply as Kasambahay",
    buttonAction: () => {
      window.location.href = "/register";
    },
    bgColor: "bg-yellow-100",
  },
  {
    title: "Employer",
    subTitle: "Look for your Kasambahay",
    image: "/layout/serviceoffered2.jpg",
    description:
      "Search for a dependable Kasambahay to help you with your household tasks with one tap.",
    buttonLabel: "Find your Kasambahay",
    buttonAction: () => {
      window.location.href = "/register";
    },
    bgColor: "bg-cyan-100",
  },
  {
    title: "KasambahayKo Inc.",
    subTitle: "Who we are",
    image: "/layout/serviceoffered3.jpg",
    description:
      "We are the KasambahayKo Inc. We are here to help you find the right person to help you with your household tasks.",
    buttonLabel: "Learn more",
    buttonAction: () => {
      useRouter().push("/aboutus");
    },
    bgColor: "bg-pink-100",
  },
];

export function HouseholdServicesGrid() {
  return (
    <div className={styles.householdServicesBG}>
      <div id="HouseholdServicesGrid" className="p-7">
        <div className="flex justify-content-center flex wrap">
          <div className="grid">
            {cardsData.map((card, index) => (
              <div key={index} className="col-12 md:col-4 ">
                <Card
                  className={`md:w-20rem ${styles["rounded-card"]} ${card.bgColor}`}
                  title={card.title}
                  subTitle={card.subTitle}
                  // style={{ width: "300px" }}
                  header={
                    <img
                      alt=""
                      src={card.image}
                      className={styles["rounded-image"]}
                    />
                  }
                >
                  <p className="text-1xl">{card.description}</p>
                  <div className="flex justify-content-center">
                    <Button
                      className="font-semibold"
                      rounded
                      onClick={card.buttonAction}
                    >
                      {card.buttonLabel}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HouseholdServicesGrid;

// import { Card } from "primereact/card";
// import { Button } from "primereact/button";
// import styles from "styles/landingpage.module.css";

// export function HouseholdServicesGrid() {
//   return (
//     <div className="p-7">
//       <div className="flex justify-content-center flex wrap">
//         <div className="grid">
//           <div className="col-12 md:col-4 ">
//             <Card
//               className={`md:w-20rem bg-yellow-100 ${styles["rounded-card"]}`}
//               title="Kasambahay"
//               subTitle="look for your Employer"
//               style={{ width: "300px" }} // Set the width and height here
//               header={
//                 <img
//                   alt=""
//                   src="/layout/babysitting.jpg"
//                   className={styles["rounded-image"]}
//                 />
//               }
//             >
//               <p className="texl-1xl ">
//                 Find a dependable family and home services in one location with
//                 a single tap.
//               </p>
//               <div className="flex justify-content-center">
//                 <Button
//                   className="font-semibold"
//                   rounded
//                   onClick={() => {
//                     window.location.href = "/register";
//                   }}
//                 >
//                   Apply as Kasambahay
//                 </Button>
//               </div>
//             </Card>
//           </div>
//           <div className="col-12 md:col-4 ">
//             <Card
//               className={`md:w-20rem bg-cyan-100 ${styles["rounded-card"]}`}
//               title="Employer"
//               subTitle="Look for your Kasambahay"
//               style={{ width: "300px" }}
//               header={
//                 <img
//                   alt=""
//                   src="/layout/house keeoing.jpg"
//                   className={styles["rounded-image"]}
//                 />
//               }
//             >
//               <p className="text-1xl">
//                 Search for a dependable Kasambahay to help you with your
//                 household tasks with one tap.
//               </p>
//               <div className="flex justify-content-center">
//                 <Button
//                   className="font-semibold"
//                   rounded
//                   onClick={() => {
//                     window.location.href = "/register";
//                   }}
//                 >
//                   Find your Kasambahay
//                 </Button>
//               </div>
//             </Card>
//           </div>
//           <div className="col-12 md:col-4">
//             <Card
//               className={`md:w-20rem bg-pink-100 ${styles["rounded-card"]}`}
//               title="KasambahayKo Inc."
//               subTitle="Who we are"
//               style={{ width: "300px" }}
//               header={
//                 <img
//                   alt=""
//                   src="/layout/pet care.jpg"
//                   className={styles["rounded-image"]}
//                 />
//               }
//             >
//               <p className="text-1xl">
//                 We are the KasambahayKo Inc. We are here to help you find the
//                 right person to help you with your household tasks.
//               </p>
//               <div className="flex justify-content-center">
//                 <Button
//                   className="font-semibold"
//                   rounded
//                   onClick={() => {
//                     router.push("/aboutus");
//                   }}
//                 >
//                   Learn more
//                 </Button>
//               </div>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default HouseholdServicesGrid;
