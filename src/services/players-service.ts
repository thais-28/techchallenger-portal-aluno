import { noContent, ok } from "../utils/http-helper";

export const getPlayerService = async () => {
  const data = {player: "Ronaldo"};
  let response = null;

  if(data.player){
    response = await ok(data);

  }
  else {
    response = await noContent();
  }

  return response;

};