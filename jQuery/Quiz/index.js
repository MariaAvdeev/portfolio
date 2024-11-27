$(document).ready(function () {
  // initialization
  let quiz = [];
  let index = 23;
  let score = 0;

  $.ajax({
    url: "quiz.json",
    method: "GET",
    dataType: "json",
    success: function (data) {
      quiz = data;

      render(quiz[index], index);
    },
    error: function () {
      alert("Error loading quiz questions.");
    },
  });

  $(document).on(
    "change",
    "input[type=radio], input[type=checkbox], input[type=text]",
    function () {
      $("#next").removeAttr("disabled");
    }
  );

  $("#done").on("click", () => {
    const answerElement = $(
      "input[type=radio]:checked, input[type=checkbox]:checked, input[type=text]"
    );
    let correct = true;

    if (answerElement.length > 1) {
      answerElement.each(function (item) {
        const value = parseInt(item.val());
        if (!quiz[index].answers.includes(value)) {
          correct = false;
        }
      });
    } else if (answerElement.length === 1) {
      if ($(answerElement)[0].type === "text") {
        const value = answerElement.val().toLowerCase();
        correct = quiz[index].answers[0].toLowerCase() === value;
      } else {
        correct = quiz[index].answers.includes(value);
      }
    } else {
      correct = false;
    }

    if (correct) {
      score += quiz[index].difficulty;
      answerElement.addClass("success");
    } else {
      answerElement.addClass("error");
    }
    $("#done").attr("disabled", "disabled");
    $("input[type=radio], input[type=checkbox], input[type=text]").attr(
      "disabled",
      "disabled"
    );
  });

  $("#next").click(function () {
    index++;
    if (!quiz[index]) {
      // result info
      let difficulty = 0.0;
      quiz.map((item) => {
        difficulty += item.difficulty;
      });

      $("#quizForm").html(
        `<p>Score: ${score}/${difficulty}</p>
        <p id="progress"></p>`
      );

      $("#progress").progressbar({
        max: difficulty,
        value: score,
        create: function () {
          const value = $(this).progressbar("value");

          if (value < 30) {
            $(".ui-progressbar-value").css("background", "#ff5722");
          } else if (value < 70) {
            $(".ui-progressbar-value").css("background", "#ffc107");
          } else {
            $(".ui-progressbar-value").css("background", "#4caf50");
          }
        },
      });
      return;
    }
    render(quiz[index], index);
    $("#done").removeAttr("disabled");
  });

  const render = (quizItem, index) => {
    let optionsHTML = "";

    if (!quizItem.options.length) {
      optionsHTML += `<li><input type="text"
      name="question${index}" value=""></li>`;
    }
    quizItem.options.map((option, indexItem) => {
      if (quizItem.answers.length === 1) {
        optionsHTML += `<li><input type="radio"
                          name="question${index}" value="${indexItem}"> ${option}</li>`;
      } else if (quizItem.answers.length > 1) {
        optionsHTML += `<li><input type="checkbox"
                          name="question${index}" value="${indexItem}"> ${option}</li>`;
      }
    });

    // display logic
    $("#quizForm").html(optionsHTML);
    $("#question").html(quizItem.question);
    $("#countQuestion").html(`${index}/${quiz.length - 1}`);
    $("#next").attr("disabled", "disabled");
  };
});
