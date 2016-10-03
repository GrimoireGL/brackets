import npm from "rollup-plugin-node-resolve";
import cjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
export default {
  entry:"./src-client/index.js",
  dest:"./dist/client.js",
  plugins:[
    npm({jsnext:true}),
    cjs(),
    babel({
      runtimeHelpers:true
    })
  ]
};
