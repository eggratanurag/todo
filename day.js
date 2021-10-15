module.exports = myday;

function myday() {
	var today = new Date();

	var options = {
		day: 'numeric',
		month: 'long',
		weekday: 'long',
	}

	var day = today.toLocaleDateString("en-us", options);
  return day;
}
