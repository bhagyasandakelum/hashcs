async function run() {
    const res = await fetch("http://localhost:3000/blog/testing-123");
    const text = await res.text();
    console.log(text.includes("Error: No slug provided") ? "SLUG ERROR" : "OK");
    if (text.includes("Error: No slug provided")) {
        const preMatch = text.match(/<pre[^>]*>(.*?)<\/pre>/is);
        if (preMatch) console.log(preMatch[1]);
    }
}
run();
