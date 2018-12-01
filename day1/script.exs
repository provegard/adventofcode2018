defmodule Files do

  def readlines(file) do
    File.stream!(file)
      |> Stream.map(&String.trim_trailing/1)
  end

  def readlines_as_numbers(file) do
    File.stream!(file)
      |> Stream.map(&String.trim_trailing/1)
      |> Stream.map(&String.to_integer/1)
  end
end

sum = Files.readlines_as_numbers("input") |> Enum.sum
IO.puts sum
