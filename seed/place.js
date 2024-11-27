const mongoose = require("mongoose");
const Place = require("../models/place");
const hereMaps = require("../utils/hereMaps");

mongoose
  .connect("mongodb://127.0.0.1/bestpoints-db")
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

async function seedPlaces() {
  const places = [
    {
      title: "Taman Mini Indonesia Indah",
      price: 20000,
      description:
        "Taman hiburan keluarga dengan berbagai replika bangunan dari seluruh Indonesia",
      location: "Taman Mini Indonesia Indah, Jakarta",
      images: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Pantai Kuta",
      price: 0,
      description:
        "Pantai yang terkenal di Bali dengan pemandangan sunset yang indah",
      location: "Pantai Kuta, Kuta, Badung Regency, Bali",
      images: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Borobudur",
      price: 0,
      description:
        "Candi Buddha terbesar di dunia yang terletak di Magelang, Jawa Tengah",
      location: "Borobudur, Magelang, Central Java",
      images: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Kawah Putih",
      price: 0,
      description:
        "Kawah vulkanik dengan danau berwarna putih di Bandung, Jawa Barat",
      location: "Kawah Putih, Ciwidey, West Java",
      images: "https://source.unsplash.com/collection/2349781/1280x720",
    },
    {
      title: "Malioboro",
      price: 0,
      description:
        "Jalan utama di Yogyakarta dengan berbagai toko dan kuliner khas",
      location: "Jl. Malioboro, Yogyakarta City, Special Region of Yogyakarta",
      images: "https://source.unsplash.com/collection/2349781/1280x720",
    },
  ];
  try {
    const newPlace = await Promise.all(
      places.map(async (place) => {
        let geoData = await hereMaps.geometry(place.location);
        const geometry = {
          type: "Point",
          coordinates: geoData.coordinates,
        };

        console.log(geometry);
        return {
          ...place,
          author: "673622c39777b60633de65af",
          images: [
            {
              url: "public\\images\\image-1732357129684-388805447.png",
              filename: "image-1732357129684-388805447.png",
            },
          ],
          geometry,
        };
      })
    );

    await Place.deleteMany({});
    await Place.insertMany(newPlace);
    console.log("Data berhasil disimpan");
  } catch (err) {
    console.log("Terjadi kesalahan saat menyimpan data:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedPlaces();
