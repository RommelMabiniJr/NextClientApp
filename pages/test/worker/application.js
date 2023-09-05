import TemplateDemo from "@/layout/demo/timeline";
import Navbar from "../../../layout/components/Navbar";

export default function WorkerApplication() {

    return (
        <div>
            <Navbar
                link1='About Us'
                link1To='/about'
                link2='Contact Us'
                link2To='/contact'
                link3='Subscribe'
                link3To='/subscribe'
            />
            <div className="p-3"></div> {/* This is a spacer to avoid content overlay */}
            <TemplateDemo />
        </div>
    )
}