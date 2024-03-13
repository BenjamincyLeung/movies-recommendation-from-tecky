import jsonfile from "jsonfile";

export const readJsonFilePromise = <T>(filepath: string) =>
  new Promise<T>((resolve, reject) => {
    jsonfile.readFile(filepath, (err:Error, data:any) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });