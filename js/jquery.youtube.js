(function($){

    $.youtube = {
        googleAccessToken: null,
        googleTokenClient: null,
        googlePlaylists: [],

        GoogleSignin: async function(clientId, callback) {
            try {
                if (window.google && window.google.accounts && window.google.accounts.oauth2) {
                    if (!$.youtube.googleTokenClient || $.youtube.googleTokenClient.clientId !== clientId) {
                        console.log('no token');
                        $.youtube.googleTokenClient = google.accounts.oauth2.initTokenClient({
                            client_id: clientId,
                            scope: 'https://www.googleapis.com/auth/youtube.readonly',
                            callback: async (response) => {
                                if (response.error) {
                                    console.error('token fail:', response.error);
                                    return response.error;
                                }
                                $.youtube.googleAccessToken = response.access_token;
                                callback();
                            }
                        });
                    }
                    $.youtube.googleTokenClient.requestAccessToken();
                } else {
                    const func = this.GoogleSignin;
                    $.getScript('https://accounts.google.com/gsi/client', function(){
                        console.log('구글 스크립트 로딩');
                        func(clientId, callback);
                    });
                }               
            } catch (error) {
                return error.message;
            }
        },

        createM3U: function(title, items) {
            const lines = ['#EXTM3U'];
            lines.push(`#${title}-${items.length}`);
            items.forEach((item) => {
                const safeTitle = (item.title || 'Untitled').replace(/\r?\n/g, ' ').trim() || 'Untitled';
                lines.push(`#EXTINF:-1,${safeTitle}`);
                lines.push(`https://www.youtube.com/watch?v=${item.videoId}`);
            });
            return lines.join('\n') + '\n';
        },

        extractPlaylistId: function(value) {
            const trimmed = value.trim();
            if (!trimmed) return null;

            if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) {
                return trimmed;
            }

            try {
                const parsed = new URL(trimmed);
                const listParam = parsed.searchParams.get('list');
                if (listParam) return listParam;
            } catch {
                return null;
            }

            return null;
        },

        getMyPlaylists: async function() {
            if (!this.googleAccessToken) {
                throw new Error('Google access token is missing.');
            }

            const response = await fetch('https://www.googleapis.com/youtube/v3/playlists?part=snippet,status&mine=true&maxResults=50', {
                headers: {
                Authorization: `Bearer ${this.googleAccessToken}`
                }
            });

            const data = await response.json();
            if (!response.ok || data.error) {
                throw new Error(data.error?.message || 'Unable to load playlists.');
            }

            this.googlePlaylists = (data.items || []).map((item) => ({
                id: item.id,
                title: item.snippet?.title || 'Untitled playlist',
                description: item.snippet?.description || ''
            }));
        },

        getPlaylistItems: async function(playlistUrl, apiKey) {
            const playlistId = $.youtube.extractPlaylistId(playlistUrl);
            if (!playlistId) {
                throw new Error(`Could not parse a playlist ID from: ${playlistUrl}`);
            }

            const playlistMetaUrl = new URL('https://www.googleapis.com/youtube/v3/playlists');
            playlistMetaUrl.searchParams.set('part', 'snippet');
            playlistMetaUrl.searchParams.set('id', playlistId);
            playlistMetaUrl.searchParams.set('key', apiKey);

            const playlistMetaResponse = await fetch(playlistMetaUrl.toString());
            if (!playlistMetaResponse.ok) {
                throw new Error(`YouTube API error ${playlistMetaResponse.status}`);
            }

            const playlistMetaData = await playlistMetaResponse.json();
            if (!playlistMetaData.items || !playlistMetaData.items.length) {
                throw new Error('Playlist not found or inaccessible.');
            }

            const playlistTitle = playlistMetaData.items[0].snippet?.title || 'Playlist';
            const items = [];
            let pageToken = '';

            while (true) {
                const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
                url.searchParams.set('part', 'snippet');
                url.searchParams.set('playlistId', playlistId);
                url.searchParams.set('maxResults', '50');
                url.searchParams.set('key', apiKey);
                if (pageToken) url.searchParams.set('pageToken', pageToken);

                const response = await fetch(url.toString());
                if (!response.ok) {
                throw new Error(`YouTube API error ${response.status}`);
                }

                const data = await response.json();
                if (data.error) {
                throw new Error(data.error.message || 'YouTube API request failed');
                }

                const pageItems = (data.items || [])
                .map((entry) => {
                    const snippet = entry.snippet || {};
                    const videoId = snippet.resourceId?.videoId;
                    if (!videoId) return null;
                    return {
                    videoId,
                    title: snippet.title || 'Untitled'
                    };
                })
                .filter(Boolean);

                items.push(...pageItems);

                if (!data.nextPageToken) break;
                pageToken = data.nextPageToken;
            }

            return { playlistTitle, items };
        }

    }
}(jQuery));