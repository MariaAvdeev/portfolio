$(document).ready(function () {
  $("#mytable #checkall").click(function () {
    if ($("#mytable #checkall").is(":checked")) {
      $("#mytable input[type=checkbox]").each(function () {
        $(this).prop("checked", true);
      });
    } else {
      $("#mytable input[type=checkbox]").each(function () {
        $(this).prop("checked", false);
      });
    }
  });

  $("[data-toggle=tooltip]").tooltip();

  $("#upload").on("click", function () {
    $.ajax({
      url: "/index.csv",
      dataType: "text",
      success: function (data) {
        let rows = data.split("\n");
        if (rows.length > 0) {
          rows = rows.slice(1);
          $("#mytable tbody").empty();
        }

        rows.forEach(function (row) {
          if (!row) {
            return;
          }
          const newCols = [
            '<td><input type=checkbox class="thischeck" /></td>',
          ];
          // adding data
          row.split(",").map((col) => {
            newCols.push(`<td class="editable">${col.trim()}</td>`);
          });
          // adding controls
          newCols.push(`<td>
                  <p data-placement="top" data-toggle="tooltip" title="Edit">
                    <button
                      class="btn btn-primary btn-xs"
                      data-bs-title="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#edit"
                    >
                      <span class="bi bi-pencil"></span>
                    </button>
                  </p>
                </td>`);
          newCols.push(`<td>
                  <p data-placement="top" data-toggle="tooltip" title="Delete">
                    <button
                      class="btn btn-danger btn-xs"
                      data-bs-title="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#delete"
                    >
                      <span class="bi bi-trash"></span>
                    </button>
                  </p>
                </td>`);

          $("<tr></tr>").append(newCols).appendTo("#mytable tbody");
        });

        editHandler();
        deleteHandler();
        $("#delete").modal();
      },
      error: function () {
        alert("Error loading the CSV file.");
      },
    });
  });

  function editHandler() {
    $('button[data-bs-title="Edit"]').click(function () {
      const targetRow = $(this).closest("tr");
      const rowData = targetRow.find(".editable");

      $("#col1").val($(rowData[0]).text());
      $("#col2").val($(rowData[1]).text());
      $("#col3").val($(rowData[2]).text());
      $("#col4").val($(rowData[3]).text());
    });
  }
  editHandler();
  deleteHandler();
  addHandler();
  $("#update").click(function () {
    const newCol1 = $("#col1").val();
    const newCol2 = $("#col2").val();
    const newCol3 = $("#col3").val();
    const newCol4 = $("#col4").val();
    if (targetRow) {
      targetRow.find(".editable").eq(0).text(newCol1);
      targetRow.find(".editable").eq(1).text(newCol2);
      targetRow.find(".editable").eq(2).text(newCol3);
      targetRow.find(".editable").eq(3).text(newCol4);
    }
    $("#edit").modal("hide");
  });

  function deleteHandler() {
    $('button[data-bs-title="Delete"]').on("click", function () {
      const targetRow = $(this).closest("tr");
      confirmRemoval(targetRow);
    });
  }

  function confirmRemoval(targetRow) {
    $("#yes").click(function () {
      console.log(targetRow, "targetRow");

      if (targetRow) {
        targetRow.remove();
        $("#delete").modal("hide");
      }
    });
  }

  function addHandler() {
    $("#buttonAdd").click(function () {
      const item = $("#inputItem").val();
      const description = $("#inputDescription").val();
      const price = $("#inputPrice").val();
      const count = $("#inputCount").val();
      if (item === "" || description === "" || price === "" || count === "") {
        alert("Please fill out both fields.");
        return;
      }
      const newRow = `<tr>
      <td><input type=checkbox class="thischeck" /></td><td class="editable">${item}</td><td class="editable">${description}</td><td class="editable">${price}</td><td class="editable">${count}</td>
      <td>
                  <p data-placement="top" data-toggle="tooltip" title="Edit">
                    <button
                      class="btn btn-primary btn-xs"
                      data-bs-title="Edit"
                      data-bs-toggle="modal"
                      data-bs-target="#edit"
                    >
                      <span class="bi bi-pencil"></span>
                    </button>
                  </p>
                </td>
                <td>
                  <p data-placement="top" data-toggle="tooltip" title="Delete">
                    <button
                      class="btn btn-danger btn-xs"
                      data-bs-title="Delete"
                      data-bs-toggle="modal"
                      data-bs-target="#delete"
                    >
                      <span class="bi bi-trash"></span>
                    </button>
                  </p>
                </td></tr>`;
      $("#mytable tbody").append(newRow);

      editHandler();
      deleteHandler();

      $("#inputItem").val("");
      $("#inputDescription").val("");
      $("#inputPrice").val("");
      $("#inputCount").val("");

      $("#addNewItem").modal("hide");
    });
  }
  $("#countMe").click(function () {
    const rows = $("#mytable tr");
    let count = 0;
    rows.each(function (index, el) {
      if (index === 0 || !$(el).find('input').is(":checked")) {
        return;
      }

      count += parseInt($(el).find("td").eq(4).html());
    });

    $("#count-input").val(count);
  });

  // $('#printTable').click(function() {
  //   const printContents = $('#mytable').html(); // Get the table HTML
  //   const originalContents = $(document).html(); // Backup the original page contents

  //   // Create a print window
  //   $(document).html(printContents)
  //   window.print(); // Trigger print dialog

  //   // Restore the original page content after printing
  //   $(document).html(originalContents)
  //   location.reload(); // Reload the page to restore the jQuery and event handlers
  // });
});
