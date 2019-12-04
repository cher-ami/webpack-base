export const customLog = (log, pToLog: any) => {
  log(
    `%c ${pToLog}`,
    "background: #2b2b2b; color: #69cbdf; padding: 2px 2px 3px"
  );
};
