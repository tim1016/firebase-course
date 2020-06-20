import * as functions from "firebase-functions";
import path = require("path");
const { Storage } = require("@google-cloud/storage");
import os = require("os");
import { db } from "./init";
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const spawn = require("child-process-promise").spawn;

const gcs = new Storage();
export const resizeThumbnail = functions.storage
  .object()
  .onFinalize(async (object, context) => {
    const fileFullPath = object.name || "",
      contentType = object.contentType || "",
      fileDir = path.dirname(fileFullPath),
      fileName = path.basename(fileFullPath);

    const tempLocalDir = path.join(os.tmpdir(), fileDir);
    // console.log("Thumbnail generation started\n");
    // console.log("fileFullPath\t", fileFullPath);
    // console.log("fileDir\t", fileDir);
    // console.log("contentType\t", contentType);
    // console.log("fileName\t", fileName);

    if (!contentType.startsWith("image/") || fileDir.startsWith("thumb_")) {
      // console.log("Not an image");
      return null;
    }

    await mkdirp(tempLocalDir);

    const bucket = gcs.bucket(object.bucket);
    const originalImageFile = bucket.file(fileFullPath);
    const tempLocalFile = path.join(os.tmpdir(), fileFullPath);

    // console.log("Downloading image to : ", tempLocalFile);
    await originalImageFile.download({ destination: tempLocalFile });

    const outputFilePath = path.join(fileDir, "thumb_" + fileName);
    const outputFile = path.join(os.tmpdir(), outputFilePath);

    console.log("Generating thumbnail to : ", outputFile);

    await spawn(
      "convert",
      [tempLocalFile, "-thumbnail", "510x287 >", outputFile],
      { capture: ["stdout", "stderr"] }
    );

    const metadata = {
      contentType: object.contentType,
      cacheControl: "public,max-age=2592000, s-maxage=2592000",
    };

    console.log(
      "uploading the thumbnail to storage, ",
      outputFile,
      outputFilePath
    );

    const uploadedFiles = await bucket.upload(outputFile, {
      destination: outputFilePath,
      metadata,
    });

    rimraf.sync(tempLocalDir);

    await originalImageFile.delete();
    const thumbnail = uploadedFiles[0];
    const url = await thumbnail.getSignedUrl({
      action: "read",
      expires: new Date(3000, 0, 1),
    });

    console.log(url);

    const frags = fileFullPath.split("/");
    const courseId = frags[1];

    console.log("saving in course: ", courseId);

    return db.doc(`courses/${courseId}`).update({ uploadedImageUrl: url });
  });
