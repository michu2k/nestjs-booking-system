import {Service} from "@prisma/client";

export const mockService: Service = {
  id: 1,
  name: "Lorem Ipsum",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  price: 27,
  createdAt: new Date(),
  updatedAt: new Date(),
  locationId: 1
};
