import { videoUrls } from "./stores";
import { writable, get } from "svelte/store";

const videosToStore = [
    { name: "ControlCenter" },
    { name: "EDMCell" },
    { name: "ElectrodeMillingCell" },
    { name: "LoadingStation" },
    { name: "MaterialStorage" },
    { name: "MeasuringCell" },
    { name: "Menue" },
    { name: "MillingCell" },
    { name: "PreparationStation" },
    { name: "WashingCell" },
    { name: "WSMDashboard" }
];

const createVideoStore = () => {
    const videosToLoad = writable(0);
    const videosLoaded = writable(0);


    async function initializeDB() {
        return /** @type {Promise<void>} */(new Promise((resolve, reject) => {
            const openRequest = indexedDB.open("LOFFactory", 3);
            let db;

            openRequest.onupgradeneeded = (event) => {
                // @ts-ignore
                db = event.target.result

                if (db.objectStoreNames.contains("videos")) {
                    db.deleteObjectStore("videos");
                }

                if (!db.objectStoreNames.contains("videos")) {
                    db.createObjectStore("videos", { keyPath: "name" });
                }
            };

            openRequest.onerror = () => {
                reject(`An error occured when initializing the database.
                Error message: ${openRequest.error}.
                If persistent, try another browser!
            `);
                console.error(openRequest.error)
            };

            openRequest.onsuccess = async (event) => {
                console.log("Database is opened!");
                // @ts-ignore
                db = event.target.result;
                videosToLoad.set(videosToStore.length - 1);
                let completed = 0;
                for (const video of videosToStore) {
                    try {
                        const saveTimeout = setTimeout(() => {
                            reject("Storage space may be low. Please try a page refresh or consider clearing some browser data.")
                        }, 20000);
                        const exists = await videoExistsInDB(db, video.name);
                        console.log(exists);
                        if (!exists) {
                            const videoBlob = await returnVideoFromNetwork(video.name);
                            // @ts-ignore
                            await saveVideoToDB(db, videoBlob, video.name);
                        }

                        if (video.name !== "Menue") {
                            completed += 1;
                            videosLoaded.set(completed);
                        }
                        clearTimeout(saveTimeout);
                    } catch (error) {
                        // @ts-ignore
                        reject(error.message);
                    }
                }
                // @ts-ignore
                videoUrls.set(videosToStore);
                resolve()
            };
        }));
    }

    // Expose store methods and properties
    return {
        videosToLoad,
        videosLoaded,
        videoUrls,
        initializeDB
    };
};

export const videoStore = createVideoStore();


/**
 * @param {{ transaction: (arg0: string[], arg1: string) => any; }} db
 * @param {string} name
 */
function videoExistsInDB(db, name) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["videos"], "readonly");
        const objectStore = transaction.objectStore("videos");
        const request = objectStore.get(name);

        request.onsuccess = () => {
            if (request.result) {
                console.log(`Video ${name} already exists in the database.`);
                const videoBlob = request.result.mp4;
                const videoObject = videosToStore.find(video => video.name === name);
                if (videoObject) {
                    // @ts-ignore
                    videoObject.url = URL.createObjectURL(videoBlob);
                }
                resolve(true);
            } else {
                resolve(false);
            }
        };

        request.onerror = () => {
            reject(new Error(`Error checking existence of video ${name}`));
        };
    });
}


/**
 * @param {string} videoName
 */
async function returnVideoFromNetwork(videoName) {
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            console.log(`Fetching video from network (attempt ${retries + 1})`);
            const response = await fetch(`/videos/${videoName}.mp4`);

            if (!response.ok) {
                throw new Error(`Network error: Could not fetch video ${videoName}`);
            }

            const mp4Blob = await response.blob();
            const videoObject = videosToStore.find(video => video.name === videoName);
            if (videoObject) {
                // @ts-ignore
                videoObject.url = URL.createObjectURL(mp4Blob);
            }
            return mp4Blob;

        } catch (error) {
            retries++;
            if (retries < maxRetries) {
                const delay = 1000 * (retries + 1); 
                console.error(`Fetch error attempt ${retries}, retrying in ${delay} ms:`, error);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error(`Max retries exceeded for video ${videoName}:`, error);
                throw error;
            }
        }
    }
}

/**
 * @param {{ transaction: (arg0: string[], arg1: string) => { (): any; new (): any; objectStore: { (arg0: string): any; new (): any; }; }; }} db
 * @param {Blob} mp4Blob
 * @param {string} name
 */
async function saveVideoToDB(db, mp4Blob, name) {
    return /** @type {Promise<void>} */(new Promise((resolve, reject) => {
        const objectStore = db.transaction(["videos"], "readwrite").objectStore("videos");
        const record = { mp4: mp4Blob, name: name };
        const request = objectStore.add(record);

        request.onsuccess = () => {
            console.log("Video saved to database successfully");
            resolve();
        };

        request.onerror = () => {
            reject(new Error(`Video could not be saved to database: ${request.error}`));
        };
    }));
}