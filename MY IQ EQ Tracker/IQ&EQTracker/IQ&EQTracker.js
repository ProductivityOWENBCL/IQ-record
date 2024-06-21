document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('subject-form');
    const tracker = document.getElementById('tracker');
    let subjects = JSON.parse(localStorage.getItem('subjects')) || [];

    const saveSubjects = () => {
        localStorage.setItem('subjects', JSON.stringify(subjects));
    };

    const loadSubjects = () => {
        subjects.forEach((subject, index) => addSubjectToTracker(subject.name, subject.percent, index));
    };

    const addSubjectToTracker = (name, percent, index) => {
        const subjectDiv = document.createElement('div');
        subjectDiv.classList.add('subject');
        
        const subjectName = document.createElement('h2');
        subjectName.innerText = name;
        subjectName.contentEditable = "true";
        subjectName.addEventListener('blur', () => updateSubject(index, subjectName.innerText, null));
        
        const percentageDiv = document.createElement('div');
        percentageDiv.classList.add('percentage');
        
        const percentageText = document.createElement('span');
        percentageText.classList.add('percentage-text');
        percentageText.setAttribute('data-percent', percent);
        percentageText.innerText = `${percent}%`;
        percentageText.contentEditable = "true";
        percentageText.addEventListener('blur', () => {
            const newPercent = parseInt(percentageText.innerText.replace('%', ''));
            updateSubject(index, null, newPercent);
        });
        
        percentageDiv.appendChild(percentageText);
        subjectDiv.appendChild(subjectName);
        subjectDiv.appendChild(percentageDiv);
        
        const editButtons = document.createElement('div');
        editButtons.classList.add('edit-buttons');
        
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerText = 'Delete';
        deleteBtn.addEventListener('click', () => deleteSubject(index));
        
        editButtons.appendChild(deleteBtn);
        subjectDiv.appendChild(editButtons);
        
        tracker.appendChild(subjectDiv);
    };

    const updateSubject = (index, newName, newPercent) => {
        if (newName !== null) subjects[index].name = newName;
        if (newPercent !== null) subjects[index].percent = newPercent;
        saveSubjects();
        tracker.innerHTML = '';
        loadSubjects();
    };

    const deleteSubject = (index) => {
        subjects.splice(index, 1);
        saveSubjects();
        tracker.innerHTML = '';
        loadSubjects();
    };

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('subject-name').value;
        const percent = document.getElementById('subject-percent').value;
        
        subjects.push({ name, percent });
        saveSubjects();
        
        tracker.innerHTML = '';
        loadSubjects();
        
        form.reset();
    });

    loadSubjects();
});
