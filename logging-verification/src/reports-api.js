export async function postReport(report, apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(report)
    });

    if (!response.ok) {
      console.error(`Failed to submit report: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error submitting report:', error.message);
  }
}
