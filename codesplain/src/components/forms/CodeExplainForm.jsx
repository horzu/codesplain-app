import { useActionState } from "react";
import { explain } from "../../actions";
import CodeExplanation from "../CodeExplanation";
import Error from "../Error";

const CodeExplainForm = () => {
	const [formState, formAction, isPending] = useActionState(explain, null);

	return (
		<div>
			<form className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md" action={formAction}>
				<label htmlFor="language">Language:</label>
				<select
					id="language"
					name="language"
					className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
					<option value="javascript">JavaScript</option>
					<option value="python">Python</option>
					<option value="java">Java</option>
					<option value="csharp">C#</option>
					<option value="cpp">C++</option>
					<option value="ruby">Ruby</option>
					<option value="go">Go</option>
					<option value="php">PHP</option>
					<option value="typescript">TypeScript</option>
				</select>
				<label htmlFor="code">Code:</label>
				<textarea
					id="code"
					name="code"
					required
					placeholder="Place your code here..."
					className="w-full h-48 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
				<button
					disabled={isPending}
					type="submit"
					className="self-end px-6 py-2 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer">
					{isPending ? "Explaining..." : "Explain Code"}
				</button>
			</form>
			{isPending ? (
				<p className="bg-gray-300 my-3 w-64 p-2">Thinking...</p>
			) : formState?.success ? (
				<CodeExplanation explanation={formState.data.explanation} />
			) : (
				formState?.success === false && <Error error={formState?.error} />
			)}
		</div>
	);
};

export default CodeExplainForm;
