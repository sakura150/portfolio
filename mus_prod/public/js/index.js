document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:5000/api/random-tracks');
        
        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Server responded with status ${response.status}: ${errorData}`);
        }
        
        const data = await response.json();
                
               const formatDuration = (interval) => {
                try {
                    const time = interval.toString().split(':');
                    return `${time[0]}:${time[1]?.padStart(2, '0') || '00'}`;
                } catch (e) {
                    console.warn('Failed to format duration:', interval);
                    return '0:00';
                }
            };
                

                const listenedContainer = document.getElementById('listened-tracks');
                data.listened.forEach(track => {
                    const trackElement = document.createElement('div');
                    trackElement.className = 'listened_track';
                    trackElement.innerHTML = `
                        <div class="track-info">
                            <p class="track-name">${track.name}</p>
                            <p class="track-artists">${track.artists.join(', ')}</p>
                        </div>
                        
                    `;
                    listenedContainer.appendChild(trackElement);
                });
         
                const recommendedContainer = document.getElementById('recommended-tracks');
                data.recommended.forEach(track => {
                    const trackElement = document.createElement('div');
                    trackElement.className = 'recommended_track';
                    trackElement.innerHTML = `
                        <div class="track-info">
                            <p class="track-name">${track.name}</p>
                            <p class="track-artists">${track.artists.join(', ')}</p>
                        </div>
                        
                    `;
                    recommendedContainer.appendChild(trackElement);
                });
            } catch (error) {
                console.error('Error loading tracks:', error);
            }
        });