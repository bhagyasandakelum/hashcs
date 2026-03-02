import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://ap-south-1.cdn.hygraph.com/content/cmjzdb2ds02v307w5zvif5axx/master';
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3Njc4MTM5NjMsImF1ZCI6WyJodHRwczovL2FwaS1hcC1zb3V0aC0xLmh5Z3JhcGguY29tL3YyL2NtanpkYjJkczAydjMwN3c1enZpZjVheHgvbWFzdGVyIiwibWFuYWdlbWVudC1uZXh0LmdyYXBoY21zLmNvbSJdLCJpc3MiOiJodHRwczovL21hbmFnZW1lbnQtYXAtc291dGgtMS5oeWdyYXBoLmNvbS8iLCJzdWIiOiI2ZGY1MzAxOS1kMjIxLTRkNGItYTE1ZS1kZGRlM2FhYTkyMzUiLCJqdGkiOiJjbWs0ZXNnMWowNngyMDdvOTNmbW1ianY3In0.XJ-vrDk9Ld_grLe6G4lNA9ILyiaIR7g5lytse78JZt2v5knMM4WD6-ihhMoCxH4NkwesQ_iQmOwjDy7xS8VyQ98OJcUwR2yzdcHY7KqVCoRJNT3TyF_Ox-KOiR09tEkSRzqy729uwTInnZE_OtZAJTDezkzw9zx2VywimZzNfn1Lxjx4BLnoj4uNhNyCIotiK3mg50i3AtGr_1t52QqPZiHy6Kc3edUWkcTOzuTYK6fv3Fp76AaEqHO2HyUGqFm9abB2wbiZ0lqtRSxLD08-1EVrsk7SMEGk04W4QT47aestE2rZTbw_izXzYc149RRAIgwZQVyJdhhPcKI3nI5l2mAd3NctpTK5yQEsrN0TdL_ybtC5P3i2TS2Rc2MHXJDtJ04PIt7dqLjyOXoP_dHiTFrZyKKcEMRgE-ngFkRirWvJKOcj4QAiYeGZf2ZcFMpDH00i2F7qY1DytiZk9M_zYiFYxKMSNY_10mgJ0ScxFH8xoJwH-QOI1W-_mIdTPenLO3MbpKdQaSmjqm8RqzugcedhfZbVtU5kAuRzUX2JY7PjFlH3uA0Rd6Y9P8sD9GaFIEavaSHRwVxCjH-DYJKNVSNb8Fn7ShRV7TMYcCx-KpV5_dXLUnSy_j4pWK8R5NF9GFZOTgghTQ4eWT3mOKvXrTKIV8hYE4MBZIDgKlJfWgc';

const client = new GraphQLClient(endpoint, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});

const GET_BLOG_PAGE = `
  query GetBlogPage($slug: String!) {
    post(where: { slug: $slug }) {
      title
      publishedAt
      content { html }
      coverImage { url }
      categories { name slug }
    }
    latestPosts: posts(orderBy: publishedAt_DESC, first: 5) {
      id
      title
      slug
      publishedAt
      coverImage { url }
    }
  }
`;

async function run() {
    try {
        const data = await client.request(GET_BLOG_PAGE, { slug: "test" });
        console.log(JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(err.message);
    }
}

run();
