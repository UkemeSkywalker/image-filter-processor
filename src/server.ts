import express from "express";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.use("/filteredimage", async (req, res) => {
    const imageUrl : string = req.query.image_url;

    if (!imageUrl) {
      res.status(400).send("invalid url");
    }
    try {
      const filteredimage : string = await filterImageFromURL(imageUrl);
      
      if(!filteredimage || filteredimage == null){
        res.status(422).send('invalid url');
      }
      res.status(200).sendFile(filteredimage);
      console.log(filteredimage);

      res.on("finish", () => {
        deleteLocalFiles([filteredimage]);
      });
    } catch (error) {
      console.log(error);
    }
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
