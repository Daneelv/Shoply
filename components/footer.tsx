import { APP_NAME } from "@/lib/constants";

const Footer = () => {
  const current_Year = new Date().getFullYear();
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {current_Year} &copy; {APP_NAME}
      </div>
    </footer>
  );
};

export default Footer;
