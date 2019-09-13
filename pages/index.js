import Layout from "../components/Layout";

export default class Index extends React.Component {
  render() {
    return(
      <Layout>
        <h1>LinkShort</h1>
        <p>A quicker way to shorten your links, along with more custom shorts!</p>
        <br/>
		<h3 id="errText"></h3>
		<h3 id="succText"></h3>
		<form id="form">
          <p>URL Short</p>
          <input className="input" id="_id" placeholder="amazon" type="text" />
          <p>URL</p>
          <input className="input" id="_redirect" placeholder="https://amazon.com" type="url" />
          <p></p>
          <button id="submit" className="button">Shorten URL!</button>
		  </form>
      </Layout>
    )
  }
  componentDidMount() {
    $("#form").submit((e)=>{    
		e.preventDefault();
		document.getElementById("errText").innerHTML = "";
		console.log({
			"_id": document.getElementById("_id").value,
			"_redirect": document.getElementById("_redirect").value
		}); 
		$.post("/",
		{
			"_id": document.getElementById("_id").value,
			"_redirect": document.getElementById("_redirect").value
		},(data, status)=>{
			if (data.taken) {
				document.getElementById("errText").innerHTML = "Error! That URL Short has been taken!"
			} else {
				document.getElementById("succText").innerHTML = "Great! Your URL is now https://s.neelr.dev/"+document.getElementById("_id").value
			}
		});
	});
  }
}