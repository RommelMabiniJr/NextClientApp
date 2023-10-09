import { Tag } from "primereact/tag";

const ServicesTemplate = (worker) => {
  return (
    <div className="col flex flex-wrap">
      {worker.services &&
        worker.services.map((service) => (
          <Tag
            key={service.service_id}
            className="mr-2"
            value={service.service_name}
          />
        ))}
    </div>
  );
};

export default ServicesTemplate;
