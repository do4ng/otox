import "colors";

class logger {
  index = 0;

  push(line: string) {
    // console.log(line);
    if (line.endsWith("\n")) line = line.slice(0, -1);
    line.split("\n").forEach((l) => {
      this.index += 1;
      process.stdout.write(
        `${`${" ".repeat(4 - String(this.index).length)}${this.index} | `.gray}`
      );
      console.log(l);
    });
  }
}

export default logger;
