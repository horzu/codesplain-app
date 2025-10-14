import MarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

const CodeExplanation = ({explanation}) => {
	return <div className="w-full max-w-4xl mt-6 bg-gray-50 p-6 rounded-2xl shadow-lg">
        <h2>Explanation:</h2>
        <MarkDown remarkPlugins={remarkGfm}>{explanation}</MarkDown>
    </div>;
};

export default CodeExplanation;
