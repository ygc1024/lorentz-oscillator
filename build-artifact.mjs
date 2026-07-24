/*  index.html(완전한 HTML 문서) → artifact.html(조각)
 *
 *  Claude Artifact는 파일을 <!doctype html><head></head><body> 안에 감싸서 게시하므로
 *  doctype·html·head·body 태그가 없는 조각을 넘겨야 한다. 두 파일을 따로 손대면
 *  반드시 어긋나므로, 배포본은 항상 이 스크립트로 index.html에서 생성한다.
 *
 *    node build-artifact.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

const src = await readFile(new URL("./index.html", import.meta.url), "utf8");

const head = src.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
const body = src.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!head || !body) throw new Error("index.html에서 <head> 또는 <body>를 찾지 못했습니다.");

// <meta>는 Artifact 호스트가 직접 붙이므로 버리고, <title>과 <style>만 남긴다.
const keep = head[1]
  .split(/\n/)
  .filter((line) => !/^\s*<meta\b/i.test(line))
  .join("\n")
  .trim();

const out = keep + "\n" + body[1].trim() + "\n";
await writeFile(new URL("./artifact.html", import.meta.url), out, "utf8");
console.log(`artifact.html 생성 완료 (${out.length.toLocaleString()} bytes)`);
