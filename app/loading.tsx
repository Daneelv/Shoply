import Image from "next/image";
import loader from "@/app/assets/loader.gif";

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Image src={loader} height={150} width={150} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
