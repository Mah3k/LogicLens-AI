export const CODE_TEMPLATES = {
  Java: `public class Main {

    public static void main(String[] args) {

        System.out.println("Hello LogicLens");

    }

}`,

  Python: `def main():
    print("Hello LogicLens")

if __name__ == "__main__":
    main()`,

  JavaScript: `function main() {

    console.log("Hello LogicLens");

}

main();`,

  C: `#include <stdio.h>

int main() {

    printf("Hello LogicLens");

    return 0;

}`,

  "C++": `#include <iostream>

using namespace std;

int main() {

    cout << "Hello LogicLens";

    return 0;

}`,

  Go: `package main

import "fmt"

func main() {

    fmt.Println("Hello LogicLens")

}`,

  SQL: `SELECT *
FROM users
WHERE id = 1;`,

  HTML: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LogicLens</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <h1>Hello LogicLens</h1>
    <p>Start building your webpage here.</p>

</body>
</html>`,

  CSS: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    background: #f5f5f5;
    color: #333;
    padding: 40px;
}

h1 {
    color: #6C63FF;
    margin-bottom: 10px;
}

p {
    font-size: 16px;
    line-height: 1.6;
}`
};