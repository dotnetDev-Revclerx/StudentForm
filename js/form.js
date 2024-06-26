$(document).ready(function () {
  let studentData = [];
  function saveToLocalStorage(data) {
    localStorage.setItem("studentData", JSON.stringify(data));
  }

  function getFromLocalStorage() {
    const data = localStorage.getItem("studentData");
    return data ? JSON.parse(data) : [];
  }

  function addStudent(event) {
    event.preventDefault();
    const studentName = $("#sname").val().trim();
    const gender = $("#gender").val();
    const studentDob = $("#dob").val();
    const studentEmail = $("#email").val();
    const studentAddress = $("#address").val();
    const mathMarks = parseFloat($("#math").val());
    const englishMarks = parseFloat($("#english").val());
    const hindiMarks = parseFloat($("#hindi").val());
    const punjabiMarks = parseFloat($("#punjabi").val());
    const rollNo = generateRollNo(studentData.length + 1);
    
    
  
   
    //   function generateRollNo(index) {
    //     const paddedIndex = String(index).padStart(4, "0");
    //     return `24${paddedIndex}`;
    // }

    function generateRollNo() {
      const rollNo = studentData.length + 1;
      return `24${String(rollNo).padStart(4, "0")}`;
    }

    function displayRollNumber() {
      const rollNo = generateRollNo();
      $("#rollNo").val(rollNo);
    }
    displayRollNumber();

    const isValid = validateInputs(
      rollNo,
      studentName,
      gender,
      studentDob,
      studentEmail,
      mathMarks,
      englishMarks,
      hindiMarks,
      punjabiMarks,
      studentAddress
    );

    if (isValid) {
      const student = {
        rollNo,
        studentName,
        studentDob,
        studentEmail,
        gender,
        mathMarks,
        englishMarks,
        hindiMarks,
        punjabiMarks,
        studentAddress,
      };
      studentData.push(student);
      saveToLocalStorage(studentData);
      $("#student-form").find("input").val("");
      Swal.fire({
        title: "Data inserted successfully",
        icon: "success",
      });
      displayData();
    } else {
      Swal.fire({
        title: "Please fill all details correctly",
        icon: "error",
      });
    }
  }

  function isWithinRange(numberValue, minimum, maximum) {
    return (
      !isNaN(numberValue) && numberValue >= minimum && numberValue <= maximum
    );
  }

  function validateInputs(
    rollNo,
    name,
    gender,
    dob,
    email,
    math,
    english,
    hindi,
    punjabi,
    address
  ) {
    // const rollNoRegex = /^24\d{4}$/;
    const nameRegex = /^[a-zA-Z\s-,]+$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    // const isRollNoValid = rollNo !== "" && rollNoRegex.test(rollNo);
    const isNameValid = name !== "" && nameRegex.test(name);
    const isEmailValid = email !== "" && emailRegex.test(email);
    const isAddressValid = address !== "";
    const isMathValid = isWithinRange(math, 0, 100);
    const isEnglishValid = isWithinRange(english, 0, 100);
    const isHindiValid = isWithinRange(hindi, 0, 100);
    const isPunjabiValid = isWithinRange(punjabi, 0, 100);
    const isGenderValid = gender !== "";
    const today = new Date();
    const dobDate = new Date(dob);
    const age = today.getFullYear() - dobDate.getFullYear();
    const isAgeValid = age >= 18;

    //  $("#roll-error").text(isRollNoValid ?  "" : "Please enter a valid roll number");
    $("#address-error").text(isAddressValid ? "" : "Please enter Address");
    $("#name-error").text(isNameValid ? "" : "Please enter a valid name");
    $("#email-error").text(isEmailValid ? "" : "Please enter a valid email");
    $("#math-error").text(
      isMathValid ? "" : "Math marks should be between 0 and 100"
    );
    $("#english-error").text(
      isEnglishValid ? "" : "English marks should be between 0 and 100"
    );
    $("#hindi-error").text(
      isHindiValid ? "" : "Hindi marks should be between 0 and 100"
    );
    $("#punjabi-error").text(
      isPunjabiValid ? "" : "Punjabi marks should be between 0 and 100"
    );
    $("#dob-error").text(isAgeValid ? "" : "Age should be at least 18 years");

    return (
      isNameValid &&
      isEmailValid &&
      isGenderValid &&
      isMathValid &&
      isEnglishValid &&
      isHindiValid &&
      isPunjabiValid & isAgeValid &&
      isAddressValid
    );
  }

  function displayData() {
    const tableBody = $("#student-table tbody");
    tableBody.empty();
    const students = getFromLocalStorage();
    $.each(students, function (index, student) {
      const row = $("<tr></tr>");
      row.append(`
                <td>${student.rollNo}</td>
                <td>${student.studentName}</td>
                <td>${student.gender}</td>
                <td>${student.studentEmail}</td>
                <td>${student.studentAddress}</td>
                <td>${student.mathMarks}</td>
                <td>${student.englishMarks}</td>
                <td>${student.hindiMarks}</td>
                <td>${student.punjabiMarks}</td>
            `);
      const totalMarks =
        student.mathMarks +
        student.englishMarks +
        student.hindiMarks +
        student.punjabiMarks;
      const percentage = (totalMarks / 400) * 100;
      const percentageCell = $("<td></td>").text(`${percentage.toFixed(2)}%`);
      if (percentage < 40) {
        row.css('background-color','red');
        row.css('color','#fff');
      }
      else if(percentage >80){
        row.css('background-color','green');
        row.css('color','#fff');
      }
      else{
        row.addClass('bg-info');
      }
      
      row.append(percentageCell);
      tableBody.append(row);
    });
  }

  function showModal(student) {
    const modalBody = $("#studentDetails");
    modalBody.empty().append(`
            <div class="form-group">
                <label for="editRollNo">Roll Number:</label>
                <input type="text" class="form-control" id="editRollNo" value="${
                  student.rollNo
                }" disabled>
            </div>
            <div class="form-group">
                <label>Name:</label>
                <input type="text" class="form-control" id="modal-name" value="${
                  student.studentName
                }">
            </div>
         
  
            <div class="form-group">
            <label for="gender">Gender:</label>
            <select id="modal-gender" class="form-control" name="gender" >
                <option value="male" ${
                  student.gender === "male" ? "selected" : ""
                }>Male</option>
                <option value="female" ${
                  student.gender === "female" ? "selected" : ""
                }>Female</option>
                <option value="Transgender" ${
                  student.gender === "Transgender" ? "selected" : ""
                }>Transgender</option>
            </select>
            <span id="gender-error" class="error"></span>
        </div>
  
            <div class="form-group">
                <label>Student Email:</label>
                <input type="email" class="form-control" id="modal-email" value="${
                  student.studentEmail
                }">
            </div>
            <div class="form-group">
                <label>Student Address:</label>
                <textarea class="form-control" id="modal-address">${
                  student.studentAddress
                }</textarea>
            </div>
            <div class="form-group">
                <label>Math Marks:</label>
                <input type="number" class="form-control" id="modal-math" value="${
                  student.mathMarks
                }" min="0" max="100">
            </div>
            <div class="form-group">
                <label>English Marks:</label>
                <input type="number" class="form-control" id="modal-english"
                value="${student.englishMarks}" min="0" max="100">
              </div>
              <div class="form-group">
                  <label>Hindi Marks:</label>
                  <input type="number" class="form-control" id="modal-hindi" value="${
                    student.hindiMarks
                  }" min="0" max="100">
              </div>
              <div class="form-group">
                  <label>Punjabi Marks:</label>
                  <input type="number" class="form-control" id="modal-punjabi" value="${
                    student.punjabiMarks
                  }" min="0" max="100">
              </div>
          `);

    $("#updateButton, #deleteButton").prop("disabled", false);

    $("#updateButton")
      .off("click")
      .click(function () {
        updateStudent(student);
      });

    $("#deleteButton")
      .off("click")
      .click(function () {
        deleteStudent(student);
      });
  }

  function updateStudent(student) {
    const rollNo = $("#editRollNo").val().trim();
    const studentName = $("#modal-name").val().trim();
    const gender = $("#modal-gender").val();
    const studentEmail = $("#modal-email").val().trim();
    const studentAddress = $("#modal-address").val().trim();
    const mathMarks = parseFloat($("#modal-math").val());
    const englishMarks = parseFloat($("#modal-english").val());
    const hindiMarks = parseFloat($("#modal-hindi").val());
    const punjabiMarks = parseFloat($("#modal-punjabi").val());
    const isValid = validateInputs(
      rollNo,
      studentName,
      gender,
      null, // dob not needed for update
      studentEmail,
      mathMarks,
      englishMarks,
      hindiMarks,
      punjabiMarks,
      studentAddress
    );

    if (isValid) {
      const updatedStudent = {
        rollNo,
        studentName,
        gender,
        studentEmail,
        studentAddress,
        mathMarks,
        englishMarks,
        hindiMarks,
        punjabiMarks,
      };
      const index = studentData.findIndex((s) => s.rollNo === student.rollNo);
      studentData[index] = updatedStudent;
      saveToLocalStorage(studentData);
      $("#editModal").modal("hide");
      Swal.fire({
        title: "Data updated successfully",
        icon: "success",
      });
      displayData();
    } else {
      Swal.fire({
        title: "Please fill all details correctly",
        icon: "error",
      });
    }
  }

  function deleteStudent(student) {
    const index = studentData.findIndex((s) => s.rollNo === student.rollNo);
    studentData.splice(index, 1);
    saveToLocalStorage(studentData);
    $("#editModal").modal("hide");
    Swal.fire({
      title: "Data deleted successfully",
      icon: "success",
    });
    displayData();
  }

  $("#add-more").click(addStudent);

  $("#edit-student").click(function () {
    $("#editRollNo").val("");
    $("#studentDetails").empty();
    $("#updateButton, #deleteButton").prop("disabled", true);
  });

  $("#searchButton").click(function () {
    const rollNo = $("#editRollNo").val().trim();
    const student = studentData.find((s) => s.rollNo === rollNo);
    if (student) {
      showModal(student);
    } else {
      Swal.fire({
        title: "No student found with the given roll number",
        icon: "error",
      });
    } ``
  });

  // Load data from localStorage on page load
  studentData = getFromLocalStorage();
  displayData();
 
});
    