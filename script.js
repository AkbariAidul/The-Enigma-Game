document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    const checkButton = document.getElementById('checkButton');
    const resetButton = document.getElementById('resetButton');
    const messageDisplay = document.getElementById('message');
    const attemptsDisplay = document.getElementById('attempts');
    const bestScoreDisplay = document.getElementById('bestScore');

    let randomNumber;
    let attempts;
    let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

    // Fungsi untuk inisialisasi/reset game
    function initGame() {
        randomNumber = Math.floor(Math.random() * 100) + 1; // Angka antara 1-100
        attempts = 0;
        messageDisplay.textContent = 'Aku memikirkan angka antara 1 sampai 100. Coba tebak!';
        updateMessageStyle('default'); // Reset style pesan
        attemptsDisplay.textContent = 'PERCOBAAN: 0'; // Update teks percobaan
        guessInput.value = ''; // Mengosongkan input
        guessInput.disabled = false;
        checkButton.disabled = false;
        checkButton.classList.remove('hidden');
        resetButton.classList.add('hidden');
        bestScoreDisplay.textContent = bestScore === 0 ? '0' : bestScore; // Update display skor terbaik
        guessInput.focus(); // Fokus otomatis pada input
    }

    // Fungsi untuk memperbarui style pesan berdasarkan status
    function updateMessageStyle(status) {
        // Hapus kelas animasi sebelumnya untuk memungkinkan re-trigger
        messageDisplay.style.animation = 'none';
        void messageDisplay.offsetWidth; // Trigger reflow
        messageDisplay.style.animation = null; // Reset animation property

        switch (status) {
            case 'success':
                messageDisplay.style.color = 'var(--color-cyber-green)';
                messageDisplay.style.textShadow = 'var(--glow-success)';
                messageDisplay.style.animation = 'textAppear 0.8s ease-out, bestScorePulse 1s infinite alternate'; // Tambah pulse untuk sukses
                break;
            case 'too_low':
            case 'too_high':
                messageDisplay.style.color = 'var(--color-cyber-blue)';
                messageDisplay.style.textShadow = 'var(--glow-medium)';
                messageDisplay.style.animation = 'textAppear 0.8s ease-out';
                break;
            case 'invalid':
                messageDisplay.style.color = 'var(--color-cyber-pink)';
                messageDisplay.style.textShadow = 'var(--glow-error)';
                messageDisplay.style.animation = 'textAppear 0.8s ease-out';
                break;
            case 'default':
            default:
                messageDisplay.style.color = 'var(--color-text-primary)';
                messageDisplay.style.textShadow = 'var(--glow-light)';
                messageDisplay.style.animation = 'textAppear 0.8s ease-out';
                break;
        }
    }

    // Fungsi untuk mengecek tebakan
    function checkGuess() {
        const userGuess = parseInt(guessInput.value);

        // Auto-clear input segera setelah nilai diambil, sebelum validasi
        guessInput.value = ''; 

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            messageDisplay.textContent = 'INVALID INPUT! ENTER NUMBER BETWEEN 1-100.';
            updateMessageStyle('invalid');
            return; // Hentikan fungsi jika input tidak valid
        }

        attempts++;
        attemptsDisplay.textContent = `PERCOBAAN: ${attempts}`;

        if (userGuess === randomNumber) {
            messageDisplay.textContent = `Berhasil! Kamu Menjawab ${randomNumber} Pada ${attempts} Percobaan!`;
            updateMessageStyle('success');
            guessInput.disabled = true; // Nonaktifkan input setelah berhasil
            checkButton.disabled = true; // Nonaktifkan tombol check
            resetButton.classList.remove('hidden'); // Tampilkan tombol main lagi

            // Update best score jika berhasil dengan tebakan lebih sedikit
            if (bestScore === 0 || attempts < bestScore) {
                bestScore = attempts;
                localStorage.setItem('bestScore', bestScore); // Simpan ke localStorage
                bestScoreDisplay.textContent = bestScore;
                messageDisplay.textContent += ' (NEW BEST SCORE!)';
            }
        } else if (userGuess < randomNumber) {
            messageDisplay.textContent = 'Terlalu Kecil, Coba Lebih Besar.';
            updateMessageStyle('too_low');
        } else {
            messageDisplay.textContent = 'Terlalu Besar, Coba Lebih Kecil.';
            updateMessageStyle('too_high');
        }
        guessInput.focus(); // Fokus kembali ke input setelah setiap tebakan
    }

    // Event Listener untuk tombol Check
    checkButton.addEventListener('click', checkGuess);

    // Event Listener untuk tombol Main Lagi
    resetButton.addEventListener('click', initGame);

    // Event Listener untuk input (saat tombol Enter ditekan)
    guessInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !guessInput.disabled) { // Pastikan input tidak disabled
            checkGuess();
        }
    });

    // Inisialisasi game saat halaman dimuat
    initGame();
});