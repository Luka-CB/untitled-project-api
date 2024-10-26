import expressAsyncHandler from "express-async-handler";
import City from "../models/City";
import Region from "../models/Region";
import Municipality from "../models/Municipality";
import Village from "../models/Village";
import { RequestHandler } from "express";

///////////////--FETCH CITIES--///////////////
// ROUTE - GET - api/address/cities
export const getCities: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const cities = await City.find();
    if (!cities) throw new Error("Request Failed!");

    res.status(200).json(cities);
  }
);

///////////////--FETCH REGIONS--///////////////
// ROUTE - GET - api/address/regions
export const getRegions: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const regions = await Region.find();
    const municipalities = await Municipality.find();
    const villages = await Village.find();

    const modifiedMnps = municipalities.map((mnp: any) => {
      const mnpVillages = villages.filter(
        (village) => village.municipality?.toString() === mnp._id?.toString()
      );
      return { ...mnp._doc, villages: mnpVillages };
    });

    const modifiedRegions = regions.map((region: any) => {
      const regionMnps = modifiedMnps.filter(
        (mnp) => mnp.region?.toString() === region._id?.toString()
      );
      return { ...region._doc, municipalities: regionMnps };
    });
    res.status(200).json({ regions: modifiedRegions });
  }
);
