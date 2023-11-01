import Head from "next/head";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";

const AboutUs = () => {
  return (
    <div className=" card surface-0">
      <div className="font-medium text-3xl text-900 mb-3">
        Movie Information
      </div>
      <div className="text-500 mb-5">
        Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit
        rutrum.
      </div>
      <ul className="list-none p-0 m-0">
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
          <div className="text-500 w-6 md:w-2 font-medium">Title</div>
          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
            Heat
          </div>
          <div className="w-6 md:w-2 flex justify-content-end"></div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
          <div className="text-500 w-6 md:w-2 font-medium">Genre</div>
          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
            <Chip label="Crime" className="mr-2" />
            <Chip label="Drama" className="mr-2" />
            <Chip label="Thriller" />
          </div>
          <div className="w-6 md:w-2 flex justify-content-end">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-text"
            />
          </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
          <div className="text-500 w-6 md:w-2 font-medium">Director</div>
          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
            Michael Mann
          </div>
          <div className="w-6 md:w-2 flex justify-content-end">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-text"
            />
          </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
          <div className="text-500 w-6 md:w-2 font-medium">Actors</div>
          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
            Robert De Niro, Al Pacino
          </div>
          <div className="w-6 md:w-2 flex justify-content-end">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-text"
            />
          </div>
        </li>
        <li className="flex align-items-center py-3 px-2 border-top-1 border-bottom-1 border-300 flex-wrap">
          <div className="text-500 w-6 md:w-2 font-medium">Plot</div>
          <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1 line-height-3">
            A group of professional bank robbers start to feel the heat from
            police when they unknowingly leave a clue at their latest heist.
          </div>
          <div className="w-6 md:w-2 flex justify-content-end">
            <Button
              label="Edit"
              icon="pi pi-pencil"
              className="p-button-text"
            />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AboutUs;
